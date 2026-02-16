package helm

import (
	"log"
	"os"
	"sort"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/release"
	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/discovery/cached/memory"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/restmapper"
	"k8s.io/client-go/tools/clientcmd"
)

type simpleRESTClientGetter struct {
	config *rest.Config
}

func (c *simpleRESTClientGetter) ToRESTConfig() (*rest.Config, error) {
	return c.config, nil
}

func (c *simpleRESTClientGetter) ToDiscoveryClient() (discovery.CachedDiscoveryInterface, error) {
	config := c.config
	discoveryClient, err := discovery.NewDiscoveryClientForConfig(config)
	if err != nil {
		return nil, err
	}
	return memory.NewMemCacheClient(discoveryClient), nil
}

func (c *simpleRESTClientGetter) ToRESTMapper() (meta.RESTMapper, error) {
	discoveryClient, err := c.ToDiscoveryClient()
	if err != nil {
		return nil, err
	}
	mapper := restmapper.NewDeferredDiscoveryRESTMapper(discoveryClient)
	expander := restmapper.NewShortcutExpander(mapper, discoveryClient, nil)
	return expander, nil
}

func (c *simpleRESTClientGetter) ToRawKubeConfigLoader() clientcmd.ClientConfig {
	loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	// This is slightly hacky but we don't need the raw config loader for what we're doing
	// primarily just the rest config.
	overrides := &clientcmd.ConfigOverrides{}
	return clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, overrides)
}

func ListReleases(config *rest.Config, namespace string) ([]*release.Release, error) {
	actionConfig := new(action.Configuration)

	clientGetter := &simpleRESTClientGetter{config: config}

	// Determine the namespace for action config initialization.
	// If listing all namespaces, we typically want to initialize with the empty string
	initNamespace := namespace
	if namespace == "" || namespace == "_all" {
		initNamespace = ""
	}

	// Use custom client getter
	if err := actionConfig.Init(clientGetter, initNamespace, os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
		return nil, err
	}


	runList := func() ([]*release.Release, error) {
		// List all releases from storage without any filter
		releases, err := actionConfig.Releases.List(func(r *release.Release) bool { return true })
		if err != nil {
			return nil, err
		}

		// Group by name and find latest version
		latestReleases := make(map[string]*release.Release)
		for _, r := range releases {
			current, exists := latestReleases[r.Name]
			if !exists || r.Version > current.Version {
				latestReleases[r.Name] = r
			}
		}

		// Convert map to slice
		results := make([]*release.Release, 0, len(latestReleases))
		for _, r := range latestReleases {
			results = append(results, r)
		}

		// Sort by name
		sort.Slice(results, func(i, j int) bool {
			return results[i].Name < results[j].Name
		})

		return results, nil
	}

	return runList()
}

func UninstallRelease(config *rest.Config, namespace, releaseName string) error {
	actionConfig := new(action.Configuration)
	clientGetter := &simpleRESTClientGetter{config: config}

	if err := actionConfig.Init(clientGetter, namespace, os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
		return err
	}

	client := action.NewUninstall(actionConfig)
	_, err := client.Run(releaseName)
	if err != nil {
		return err
	}
	return nil
}
