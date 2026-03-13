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
 * User configuration entity for database storage
 */
let UserConfig = class UserConfig {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserConfig.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserConfig.prototype, "username", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], UserConfig.prototype, "routing", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], UserConfig.prototype, "additionalConfig", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserConfig.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserConfig.prototype, "updatedAt", void 0);
UserConfig = __decorate([
    Entity({ name: 'user_configs' })
], UserConfig);
export { UserConfig };
export default UserConfig;
//# sourceMappingURL=UserConfig.js.map