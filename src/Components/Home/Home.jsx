import React from 'react'

export default function Home() {
  return <>
    <div className="container pt-5">
      <div className="content">
        <h1 className="text-center fw-bold">Overview</h1>
        <p>Hashing and encryption are two important techniques in cybersecurity, but they work in very different ways. SHA-1 (Secure Hash Algorithm 1) is a cryptographic hash function. It takes any input—whether it’s a short password or a large file—and turns it into a fixed-length 160-bit output, called a hash or digest. The main idea is that even a small change in the input completely changes the hash, which helps in checking if data has been modified. However, SHA-1 is now considered insecure, because researchers have found ways to create different inputs that produce the same hash—a problem called a collision. For secure applications, algorithms like SHA-256 or SHA-3 are now preferred.
        On the other hand, RSA is an asymmetric encryption algorithm, which means it uses a pair of keys: a public key that can be shared with anyone, and a private key that must be kept secret. If someone encrypts a message using your public key, only your private key can decrypt it. RSA is also used for digital signatures, where a message is signed with a private key and can be verified by anyone using the public key. The security of RSA depends on the difficulty of factoring very large numbers, which is easy to verify but extremely hard to reverse without the key.
        Finally, CBC (Cipher Block Chaining) is a mode of operation used with symmetric encryption algorithms like AES. It improves security by making each encrypted block of data depend on the previous one. In CBC, before a plaintext block is encrypted, it is combined (using XOR) with the ciphertext of the previous block. This means that even if two blocks of plaintext are the same, their encrypted forms will be different—as long as the previous ciphertext is different. The first block uses a random Initialization Vector (IV) instead of a previous ciphertext to start the chain. However, if the IV is reused or predictable,
        CBC can be vulnerable to certain attacks. That's why IVs must always be random and unique for each encryption session.
        </p>
      </div>
    </div>
  </>
}
