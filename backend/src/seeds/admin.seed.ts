import { DataSource } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Role } from '../user/types/role.enum';
import { User } from '../user/user.entity';
import { Admin } from '../admin/admin.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const adminRepo = dataSource.getRepository(Admin);

  const existing = await userRepo.findOneBy({ email: 'admin@example.com' });
  if (existing) return;

  const hashedPassword = await bcrypt.hash('SuperSecurePassword', 10);

  const user = userRepo.create({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: Role.Admin,
  });

  await userRepo.save(user);

  const admin = adminRepo.create({ user: user });
  await adminRepo.save(admin);

  console.log('Admin user created successfully!');
}
