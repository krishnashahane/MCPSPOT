import { join } from 'path';
import { pathToFileURL } from 'url';
const registry = new Map();
const instances = new Map();
async function tryLoadOverride(key, overridePath) {
    try {
        const moduleUrl = pathToFileURL(overridePath).href;
        const mod = await import(moduleUrl);
        const override = mod[key.charAt(0).toUpperCase() + key.slice(1) + 'x'];
        if (typeof override === 'function') {
            return override;
        }
    }
    catch (error) {
        // Ignore not-found errors and keep trying other paths; surface other errors for visibility
        if (error?.code !== 'ERR_MODULE_NOT_FOUND' && error?.code !== 'MODULE_NOT_FOUND') {
            console.warn(`Failed to load service override from ${overridePath}:`, error);
        }
    }
    return undefined;
}
export async function registerService(key, entry) {
    // Try to load override immediately during registration
    // Try multiple paths and file extensions in order
    const serviceDirs = ['src/services', 'dist/services'];
    const fileExts = ['.ts', '.js'];
    const overrideFileName = key + 'x';
    for (const serviceDir of serviceDirs) {
        for (const fileExt of fileExts) {
            const overridePath = join(process.cwd(), serviceDir, overrideFileName + fileExt);
            const override = await tryLoadOverride(key, overridePath);
            if (override) {
                entry.override = override;
                break; // Found override, exit both loops
            }
        }
        // If override was found, break out of outer loop too
        if (entry.override) {
            break;
        }
    }
    registry.set(key, entry);
}
export function getService(key) {
    if (instances.has(key)) {
        return instances.get(key);
    }
    const entry = registry.get(key);
    if (!entry)
        throw new Error(`Service not registered for key: ${key.toString()}`);
    // Use override if available, otherwise use default
    const Impl = entry.override || entry.defaultImpl;
    const instance = new Impl();
    instances.set(key, instance);
    return instance;
}
//# sourceMappingURL=registry.js.map