package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.CreateEventParam;

public interface CreateEventUseCase {

	Event execute(CreateEventParam param);
}
