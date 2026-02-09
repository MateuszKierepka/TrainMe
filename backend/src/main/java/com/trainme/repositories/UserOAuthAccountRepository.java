package com.trainme.repositories;

import com.trainme.entities.UserOAuthAccount;
import com.trainme.enums.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserOAuthAccountRepository extends JpaRepository<UserOAuthAccount, UUID> {

    Optional<UserOAuthAccount> findByProviderAndProviderAccountId(OAuthProvider provider, String providerAccountId);
}
