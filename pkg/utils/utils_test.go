package utils

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGetImageRegistryAndRepo(t *testing.T) {
	testcase := []struct {
		image    string
		registry string
		repo     string
	}{
		{"nginx", "", "library/nginx"},
		{"nginx:latest", "", "library/nginx"},
		{"pixelvide/kube-sentinel:latest", "", "pixelvide/kube-sentinel"},
		{"docker.io/library/nginx", "docker.io", "library/nginx"},
		{"docker.io/library/nginx:latest", "docker.io", "library/nginx"},
		{"gcr.io/my-project/my-image", "gcr.io", "my-project/my-image"},
		{"gcr.io/my-project/my-image:tag", "gcr.io", "my-project/my-image"},
		{"quay.io/my-org/my-repo", "quay.io", "my-org/my-repo"},
		{"quay.io/my-org/my-repo:tag", "quay.io", "my-org/my-repo"},
		{"registry.example.com/my-repo/test", "registry.example.com", "my-repo/test"},
	}
	for _, tc := range testcase {
		registry, repo := GetImageRegistryAndRepo(tc.image)
		if registry != tc.registry || repo != tc.repo {
			t.Errorf("GetImageRegistryAndRepo(%q) = (%q, %q), want (%q, %q)", tc.image, registry, repo, tc.registry, tc.repo)
		}
	}
}

func TestIsSecureRegistry(t *testing.T) {
	testcases := []struct {
		host      string
		shouldErr bool
	}{
		{"docker.io", false},
		{"quay.io", false},
		{"gcr.io", false},
		{"localhost", true},
		{"localhost:5000", true},
		{"127.0.0.1", true},
		{"127.0.0.1:5000", true},
		{"[::1]", true},
		{"[::1]:5000", true},
		{"google.com", false},
		{"0.0.0.0", true},
	}

	for _, tc := range testcases {
		err := IsSecureRegistry(tc.host)
		if tc.shouldErr && err == nil {
			t.Errorf("IsSecureRegistry(%q) should have failed but passed", tc.host)
		}
		if !tc.shouldErr && err != nil {
			t.Errorf("IsSecureRegistry(%q) failed: %v", tc.host, err)
		}
	}
}

func TestGenerateNodeAgentName(t *testing.T) {
	testcase := []struct {
		nodeName string
	}{
		{"node1"},
		{"shortname"},
		{"a-very-long-node-name-that-exceeds-the-maximum-length-allowed-for-kubernetes-names"},
		{"node-with-63-characters-abcdefghijklmnopqrstuvwxyz-123456789101"},
	}

	for _, tc := range testcase {
		podName := GenerateNodeAgentName(tc.nodeName)
		if len(podName) > 63 {
			t.Errorf("GenerateNodeAgentName(%q) = %q, length %d exceeds 63", tc.nodeName, podName, len(podName))
		}
	}
}

func TestUserCredentialsPermissions(t *testing.T) {
	// Create a temporary directory for testing
	tempDir := t.TempDir()

	// Override DataDir for testing
	originalDataDir := DataDir
	DataDir = tempDir
	defer func() { DataDir = originalDataDir }()

	storageNamespace := "secure-user"

	// Test GetUserGlabConfigDir permissions
	glabDir, err := GetUserGlabConfigDir(storageNamespace)
	if err != nil {
		t.Fatalf("GetUserGlabConfigDir failed: %v", err)
	}

	info, err := os.Stat(glabDir)
	if err != nil {
		t.Fatalf("Failed to stat glab dir: %v", err)
	}
	mode := info.Mode().Perm()
	if mode != 0700 {
		t.Errorf("Glab Config Dir Permissions: got %o, want 0700", mode)
	}

	// Test WriteUserAWSCredentials permissions
	err = WriteUserAWSCredentials(storageNamespace, "aws_access_key_id=test")
	if err != nil {
		t.Fatalf("WriteUserAWSCredentials failed: %v", err)
	}

	awsFile := GetUserAWSCredentialsPath(storageNamespace)
	info, err = os.Stat(awsFile)
	if err != nil {
		t.Fatalf("Failed to stat aws file: %v", err)
	}
	mode = info.Mode().Perm()
	if mode != 0600 {
		t.Errorf("AWS Credentials File Permissions: got %o, want 0600", mode)
	}

	awsDir := filepath.Dir(awsFile)
	info, err = os.Stat(awsDir)
	if err != nil {
		t.Fatalf("Failed to stat aws dir: %v", err)
	}
	mode = info.Mode().Perm()
	if mode != 0700 {
		t.Errorf("AWS Config Dir Permissions: got %o, want 0700", mode)
	}
}
