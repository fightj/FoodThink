package com.ssafy.foodthink.global.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;

public class ElasticsearchClientConfig {
    private ElasticsearchClient client;

    public ElasticsearchClientConfig() {
        RestClient restClient = RestClient.builder(new HttpHost("i12e107.p.ssafy.io", 9200)).build();

        this.client = new ElasticsearchClient(
                new RestClientTransport(restClient, new JacksonJsonpMapper())
        );
    }

    public ElasticsearchClient getClient() {
        return client;
    }
}
