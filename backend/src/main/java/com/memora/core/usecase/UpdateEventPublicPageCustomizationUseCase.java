package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UpdateEventPublicPageCustomizationParam;

public interface UpdateEventPublicPageCustomizationUseCase {

	EventPublicPageCustomization execute(UpdateEventPublicPageCustomizationParam param);
}
