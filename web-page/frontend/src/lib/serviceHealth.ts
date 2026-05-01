export const services = [
  { name: "AuraHR Frontend", url: "http://127.0.0.1:3005", port: 3005 },
  { name: "AuraHR Command API", url: "http://127.0.0.1:8081/health", port: 8081 },
];

export interface ServiceStatus {
  name: string;
  url: string;
  port: number;
  status: "UP" | "DOWN" | "CHECKING";
}

export const checkServices = async (): Promise<ServiceStatus[]> => {
  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch(service.url, { 
          signal: controller.signal,
          mode: 'no-cors' // Use no-cors to avoid preflight issues for simple health checks
        });
        
        clearTimeout(timeoutId);
        return { ...service, status: "UP" as const };
      } catch (error) {
        return { ...service, status: "DOWN" as const };
      }
    })
  );
  return results;
};
