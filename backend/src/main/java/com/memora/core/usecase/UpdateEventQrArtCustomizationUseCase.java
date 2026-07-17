package com.memora.core.usecase;

import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.param.UpdateEventQrArtCustomizationParam;

public interface UpdateEventQrArtCustomizationUseCase {
	EventQrArtCustomization execute(UpdateEventQrArtCustomizationParam param);
}
