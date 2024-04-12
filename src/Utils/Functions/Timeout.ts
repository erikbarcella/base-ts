const route = async (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

export default route;