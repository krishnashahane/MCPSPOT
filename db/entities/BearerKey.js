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
 * Bearer authentication key entity
 * Stores multiple bearer keys with per-key enable/disable and scoped access control
 */
let BearerKey = class BearerKey {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], BearerKey.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], BearerKey.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 512 }),
    __metadata("design:type", String)
], BearerKey.prototype, "token", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BearerKey.prototype, "enabled", void 0);
__decorate([
    Column({ type: 'varchar', length: 20, default: 'all' }),
    __metadata("design:type", String)
], BearerKey.prototype, "accessType", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], BearerKey.prototype, "allowedGroups", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], BearerKey.prototype, "allowedServers", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], BearerKey.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], BearerKey.prototype, "updatedAt", void 0);
BearerKey = __decorate([
    Entity({ name: 'bearer_keys' })
], BearerKey);
export { BearerKey };
export default BearerKey;
//# sourceMappingURL=BearerKey.js.map