import Text "mo:base/Text";

actor {
    // Simple health check endpoint
    public query func healthCheck() : async Text {
        return "Healthy";
    };
}
