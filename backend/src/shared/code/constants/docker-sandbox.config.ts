export interface DockerSandboxConfig {
  image: string;
  memoryLimit: string;
  network: string;
  timeoutMs: number;
}
