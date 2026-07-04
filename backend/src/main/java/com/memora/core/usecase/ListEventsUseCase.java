package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.ListEventsParam;
import java.util.List;

public interface ListEventsUseCase {

	List<Event> execute(ListEventsParam param);
}
