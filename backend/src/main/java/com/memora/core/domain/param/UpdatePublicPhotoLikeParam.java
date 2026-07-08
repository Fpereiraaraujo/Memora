package com.memora.core.domain.param;

import java.util.UUID;

public record UpdatePublicPhotoLikeParam(
	String slug,
	UUID photoId,
	boolean liked
) {
}
