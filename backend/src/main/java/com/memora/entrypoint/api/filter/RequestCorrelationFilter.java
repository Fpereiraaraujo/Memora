package com.memora.entrypoint.api.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestCorrelationFilter extends OncePerRequestFilter {

	private static final String HEADER_NAME = "X-Request-Id";
	private static final String MDC_KEY = "requestId";

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String requestId = resolveRequestId(request.getHeader(HEADER_NAME));
		MDC.put(MDC_KEY, requestId);
		response.setHeader(HEADER_NAME, requestId);

		try {
			filterChain.doFilter(request, response);
		} finally {
			MDC.remove(MDC_KEY);
		}
	}

	private String resolveRequestId(String candidate) {
		if (candidate != null && candidate.matches("[A-Za-z0-9._-]{8,80}")) {
			return candidate;
		}

		return UUID.randomUUID().toString();
	}
}
