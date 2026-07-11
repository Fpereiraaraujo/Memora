package com.memora.core.usecase;

import com.memora.core.domain.model.EventCheckoutPreview;
import com.memora.core.domain.param.PreviewEventCheckoutParam;

public interface PreviewEventCheckoutUseCase {

	EventCheckoutPreview execute(PreviewEventCheckoutParam param);
}
