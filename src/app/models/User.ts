import { Column, CreateDateColumn, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

@Entity("users")
class User {

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column()
    password_reset_token: string;

    @Column()
    password_reset_experies: Date;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
  
    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { User }