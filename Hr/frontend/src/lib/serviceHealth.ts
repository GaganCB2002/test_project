export const services = [
  { name: "CEO Dashboard", url: "http://127.0.0.1:3001", port: 3001 },
  { name: "WorkPulse Hub", url: "http://127.0.0.1:3005", port: 3005 },
  { name: "HR Backend", url: "http://127.0.0.1:8081/health", port: 8081 },
  { name: "Employee Backend", url: "http://127.0.0.1:8000/health", port: 8000 },
  { name: "Tech Lead Hub", url: "http://127.0.0.1:3003", port: 3003 },
  { name: "Tech Lead API", url: "http://127.0.0.1:5000/api/health", port: 5000 },
  { name: "Marketing Service", url: "http://127.0.0.1:3006/health", port: 3006 },
  { name: "Helpdesk Hub", url: "http://127.0.0.1:3004", port: 3004 },
  { name: "Helpdesk API", url: "http://127.0.0.1:5005/api/health", port: 5005 },
  { name: "Location Hub", url: "http://127.0.0.1:3007", port: 3007 },
  { name: "Location API", url: "http://127.0.0.1:3017/health", port: 3017 },
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
