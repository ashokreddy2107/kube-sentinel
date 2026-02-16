package utils

import "testing"

func TestEncryptDecryptString(t *testing.T) {
	original := "Hello, World!asdas"
	encrypted := EncryptString(original)
	decrypted, err := DecryptString(encrypted)
	t.Log("Encrypted:", encrypted)
	t.Log("Decrypted:", decrypted)
	if err != nil {
		t.Fatalf("DecryptString() failed: %v", err)
	}
	if decrypted != original {
		t.Errorf("DecryptString() = %q, want %q", decrypted, original)
	}
}

func TestGenerateSecureToken(t *testing.T) {
	lengths := []int{16, 32, 64}
	for _, length := range lengths {
		token, err := GenerateSecureToken(length)
		if err != nil {
			t.Fatalf("GenerateSecureToken(%d) failed: %v", length, err)
		}
		if len(token) != length {
			t.Errorf("GenerateSecureToken(%d) length = %d, want %d", length, len(token), length)
		}
		if token == "" {
			t.Errorf("GenerateSecureToken(%d) returned empty string", length)
		}
	}
}
