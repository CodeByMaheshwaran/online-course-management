package com.college_directory_app.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtUtils {
	private SecretKey key;
	private static final Long EXPIRATION_TIME = 86400000L; // 24 hours;

	public JwtUtils() {
		String secretString = "78794554651218515151659845132151684R51215184R54R44545R445444445R54R";
		byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
		this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
	}

	public String generateToken(UserDetails userdetails) {
		return Jwts.builder()
				.subject(userdetails.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(key).compact();
	}
	
	public String generateRefreshToken(HashMap<String,Object> claims, UserDetails userdetails) {
	
		return Jwts.builder()
				.claims(claims)
				.subject(userdetails.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(key)
				.compact();
	
	}
	
	public String extractUserName(String token) {
	return extractClaims(token,Claims::getSubject);	
	}

	private <T> T extractClaims(String token, Function<Claims,T> claimsTFunction) {
		return claimsTFunction.apply(Jwts.parser().verifyWith(key).build()
				.parseSignedClaims(token).getPayload());
	}

	public boolean isTokenVaild(String token,UserDetails userDetails) {
		final String username=extractUserName(token);
		return (username.equals(userDetails.getUsername()) && !isTokenNotExpired(token));
	}

	public boolean isTokenNotExpired(String token) {
		return extractClaims(token, Claims::getExpiration).before(new Date()) ;
	}
	
	
}
