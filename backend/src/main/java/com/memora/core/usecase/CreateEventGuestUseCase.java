package com.memora.core.usecase;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.param.CreateEventGuestParam;

public interface CreateEventGuestUseCase { EventGuest execute(CreateEventGuestParam param); }
