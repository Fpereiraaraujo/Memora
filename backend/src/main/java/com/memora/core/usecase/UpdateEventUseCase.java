package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.UpdateEventParam;

public interface UpdateEventUseCase {

	Event execute(UpdateEventParam param);
}
