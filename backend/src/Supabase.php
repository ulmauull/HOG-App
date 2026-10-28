<?php
namespace Hog;

require_once __DIR__ . '/../config/config.php';

/**
 * Supabase Helper Service
 * 
 * Provides native integration for:
 * 1. Supabase Storage (uploading payment proofs directly to Supabase S3-compatible cloud storage)
 * 2. Supabase PostgREST Client (querying Supabase via REST if direct PostgreSQL port is blocked)
 */
class Supabase {

    /**
     * Uploads a file to Supabase Storage bucket.
     * 
     * @param string $localFilePath Absolute path to local temporary file
     * @param string $mimeType MIME type (e.g. image/jpeg, image/png)
     * @param string $destinationFilename Desired filename in the bucket
     * @return string|null Public URL of the uploaded asset, or null if Supabase is unconfigured / failed
     */
    public static function uploadToStorage(string $localFilePath, string $mimeType, string $destinationFilename): ?string {
        $supabaseUrl = rtrim(SUPABASE_URL, '/');
        $apiKey = SUPABASE_SERVICE_ROLE_KEY ?: SUPABASE_ANON_KEY;

        if (empty($supabaseUrl) || empty($apiKey)) {
            // Supabase Storage credentials not configured, fallback to local storage
            return null;
        }

        $bucket = SUPABASE_STORAGE_BUCKET;
        $endpoint = "{$supabaseUrl}/storage/v1/object/{$bucket}/{$destinationFilename}";

        $fileContent = file_get_contents($localFilePath);
        if ($fileContent === false) {
            return null;
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $endpoint,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $fileContent,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$apiKey}",
                "apikey: {$apiKey}",
                "Content-Type: {$mimeType}",
                "x-upsert: true"
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            // Return public URL
            return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$destinationFilename}";
        }

        return null;
    }

    /**
     * Checks if Supabase Cloud credentials are configured.
     */
    public static function isConfigured(): bool {
        return !empty(SUPABASE_URL) && (!empty(SUPABASE_SERVICE_ROLE_KEY) || !empty(SUPABASE_ANON_KEY));
    }
}
