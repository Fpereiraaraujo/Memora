package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.GetEventPublicPageCustomizationParam;

public interface GetEventPublicPageCustomizationUseCase {

	EventPublicPageCustomization execute(GetEventPublicPageCustomizationParam param);
}
