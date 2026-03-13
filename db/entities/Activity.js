var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
/**
 * Activity entity for tracking tool call history
 * Only available in database mode
 */
let Activity = class Activity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Activity.prototype, "id", void 0);
__decorate([
    CreateDateColumn({ name: 'timestamp', type: 'timestamp' }),
    __metadata("design:type", Date)
], Activity.prototype, "timestamp", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Activity.prototype, "server", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Activity.prototype, "tool", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], Activity.prototype, "duration", void 0);
__decorate([
    Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Activity.prototype, "status", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "input", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "output", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'group_name' }),
    __metadata("design:type", String)
], Activity.prototype, "group", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'key_id' }),
    __metadata("design:type", String)
], Activity.prototype, "keyId", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'key_name' }),
    __metadata("design:type", String)
], Activity.prototype, "keyName", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'error_message' }),
    __metadata("design:type", String)
], Activity.prototype, "errorMessage", void 0);
Activity = __decorate([
    Entity({ name: 'activities' }),
    Index(['server']),
    Index(['tool']),
    Index(['status']),
    Index(['group']),
    Index(['keyId']),
    Index(['timestamp'])
], Activity);
export { Activity };
export default Activity;
//# sourceMappingURL=Activity.js.map