package com.memora.core.usecase;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.param.ListEventGuestsParam;

public interface ListEventGuestsUseCase { PageResult<EventGuest> execute(ListEventGuestsParam param); }
