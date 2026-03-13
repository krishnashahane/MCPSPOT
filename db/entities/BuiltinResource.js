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
 * Built-in resource entity for database storage
 */
let BuiltinResource = class BuiltinResource {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], BuiltinResource.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 1024, unique: true }),
    __metadata("design:type", String)
], BuiltinResource.prototype, "uri", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BuiltinResource.prototype, "name", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BuiltinResource.prototype, "description", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BuiltinResource.prototype, "mimeType", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], BuiltinResource.prototype, "content", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BuiltinResource.prototype, "enabled", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], BuiltinResource.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], BuiltinResource.prototype, "updatedAt", void 0);
BuiltinResource = __decorate([
    Entity({ name: 'builtin_resources' })
], BuiltinResource);
export { BuiltinResource };
export default BuiltinResource;
//# sourceMappingURL=BuiltinResource.js.map