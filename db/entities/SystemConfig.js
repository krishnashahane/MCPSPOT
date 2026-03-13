var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
/**
 * System configuration entity for database storage
 * Using singleton pattern - only one record with id = 'default'
 */
let SystemConfig = class SystemConfig {
};
__decorate([
    PrimaryColumn({ type: 'varchar', length: 50, default: 'default' }),
    __metadata("design:type", String)
], SystemConfig.prototype, "id", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "routing", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "install", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "smartRouting", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "mcpRouter", void 0);
__decorate([
    Column({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], SystemConfig.prototype, "nameSeparator", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "oauth", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "oauthServer", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SystemConfig.prototype, "auth", void 0);
__decorate([
    Column({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], SystemConfig.prototype, "enableSessionRebuild", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SystemConfig.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SystemConfig.prototype, "updatedAt", void 0);
SystemConfig = __decorate([
    Entity({ name: 'system_config' })
], SystemConfig);
export { SystemConfig };
export default SystemConfig;
//# sourceMappingURL=SystemConfig.js.map