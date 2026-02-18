package com.trainme.repositories;

import com.trainme.entities.User;
import com.trainme.entities.UserOAuthAccount;
import com.trainme.enums.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserOAuthAccountRepository extends JpaRepository<UserOAuthAccount, UUID> {

    Optional<UserOAuthAccount> findByProviderAndProviderAccountId(OAuthProvider provider, String providerAccountId);

    @Modifying
    @Query("DELETE FROM UserOAuthAccount uoa WHERE uoa.user IN :users")
    void deleteByUserIn(@Param("users") List<User> users);
}
