package com.memora.core.usecase;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageCoverImageParam;

public interface RemoveEventPublicPageCoverImageUseCase {

	EventPublicPageCustomization execute(RemoveEventPublicPageCoverImageParam param);
}
