package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageDecorativeImageParam;

public interface RemoveEventPublicPageDecorativeImageUseCase {

	EventPublicPageCustomization execute(RemoveEventPublicPageDecorativeImageParam param);
}
