package com.memora.shared;

import com.memora.core.domain.port.SlugGeneratorPort;
import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class SlugGenerator implements SlugGeneratorPort {

	private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");
	private static final Pattern NON_SLUG = Pattern.compile("[^a-z0-9]+");

	@Override
	public String generate(String source) {
		String normalized = Normalizer.normalize(source, Normalizer.Form.NFD);
		String withoutMarks = DIACRITICS.matcher(normalized).replaceAll("");
		String slug = NON_SLUG.matcher(withoutMarks.toLowerCase(Locale.ROOT)).replaceAll("-");
		return slug.replaceAll("^-+|-+$", "");
	}
}

