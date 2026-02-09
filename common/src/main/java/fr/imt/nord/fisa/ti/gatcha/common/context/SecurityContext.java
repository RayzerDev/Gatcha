package fr.imt.nord.fisa.ti.gatcha.common.context;

public class SecurityContext {
    private static final ThreadLocal<String> username = new ThreadLocal<>();
    private static final ThreadLocal<String> token = new ThreadLocal<>();

    public static void set(String t, String u) {
        token.set(t);
        username.set(u);
    }

    public static String getUsername() {
        return username.get();
    }

    public static String getToken() {
        return token.get();
    }

    public static void clear() {
        token.remove();
        username.remove();
    }
}
