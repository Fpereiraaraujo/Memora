package com.memora.core.usecase;

import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.param.GetEventQrArtCustomizationParam;

public interface GetEventQrArtCustomizationUseCase {
	EventQrArtCustomization execute(GetEventQrArtCustomizationParam param);
}
