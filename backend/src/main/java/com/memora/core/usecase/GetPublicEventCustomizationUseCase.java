package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.GetPublicEventCustomizationParam;

public interface GetPublicEventCustomizationUseCase {

	EventPublicPageCustomization execute(GetPublicEventCustomizationParam param);
}
