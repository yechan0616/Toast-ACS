package com.toastacs.api.domain.admin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "admin_account")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(length = 50)
    private String name;

    @Column(columnDefinition = "text")
    private String avatar;

    public static AdminAccount create(String username, String passwordHash, String name) {
        AdminAccount account = new AdminAccount();
        account.username = username;
        account.passwordHash = passwordHash;
        account.name = name;
        return account;
    }

    public void rename(String name) {
        this.name = name;
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void changeAvatar(String avatar) {
        this.avatar = avatar;
    }
}
