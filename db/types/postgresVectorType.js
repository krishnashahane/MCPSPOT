/**
 * Register the PostgreSQL vector type with TypeORM
 * @param dataSource TypeORM data source
 */
export function registerPostgresVectorType(dataSource) {
    // Skip if not postgres
    if (dataSource.driver.options.type !== 'postgres') {
        return;
    }
    // Get the postgres driver
    const pgDriver = dataSource.driver;
    // Add 'vector' to the list of supported column types
    if (pgDriver.supportedDataTypes) {
        pgDriver.supportedDataTypes.push('vector');
    }
    // Override the normalization for the vector type
    if (pgDriver.dataTypeDefaults) {
        pgDriver.dataTypeDefaults['vector'] = {
            type: 'vector',
        };
    }
    // Override the column type resolver to prevent it from converting vector to other types
    const originalColumnTypeResolver = pgDriver.columnTypeResolver;
    if (originalColumnTypeResolver) {
        pgDriver.columnTypeResolver = (column) => {
            if (column.type === 'vector') {
                return 'vector';
            }
            return originalColumnTypeResolver(column);
        };
    }
}
//# sourceMappingURL=postgresVectorType.js.map