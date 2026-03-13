var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
/**
 * Server configuration entity for database storage
 */
let Server = class Server {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Server.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Server.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "type", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "description", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "url", void 0);
__decorate([
    Column({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "command", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], Server.prototype, "args", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "env", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "headers", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Server.prototype, "enabled", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "owner", void 0);
__decorate([
    Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Server.prototype, "enableKeepAlive", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Server.prototype, "keepAliveInterval", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "tools", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "prompts", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "resources", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "options", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "oauth", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "proxy", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Server.prototype, "openapi", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Server.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Server.prototype, "updatedAt", void 0);
Server = __decorate([
    Entity({ name: 'servers' })
], Server);
export { Server };
export default Server;
//# sourceMappingURL=Server.js.map