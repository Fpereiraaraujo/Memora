package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.UpdateEventStatusParam;

public interface UpdateEventStatusUseCase {

	Event execute(UpdateEventStatusParam param);
}
