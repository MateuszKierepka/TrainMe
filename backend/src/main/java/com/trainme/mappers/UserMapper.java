package com.trainme.mappers;

import com.trainme.dtos.AuthResponse;
import com.trainme.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AuthResponse toAuthResponse(User user);
}
