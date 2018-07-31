/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.baishancloud.web.api;

import com.baishancloud.web.AbstractStandardResource;
import com.baishancloud.web.api.ProcessorWebUtils;
import org.apache.nifi.web.ComponentDetails;
import org.apache.nifi.web.NiFiWebConfigurationContext;
import org.apache.nifi.web.NiFiWebConfigurationRequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;

@Path("/store/procedure/processor")
public class ProcessorResource extends AbstractStandardResource {

    private static final Logger logger = LoggerFactory.getLogger(ProcessorResource.class);


    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Path("/details")
    public Response getDetails(@QueryParam("processorId") final String processorId) {
        final NiFiWebConfigurationContext nifiWebContext = getWebConfigurationContext();
        final ComponentDetails componentDetails = ProcessorWebUtils.getComponentDetails(nifiWebContext, processorId, request);
        final Response.ResponseBuilder response = ProcessorWebUtils.applyCacheControl(Response.ok(componentDetails));
        return response.build();
    }

    @PUT
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Path("/properties")
    public Response setProperties(@QueryParam("processorId") final String processorId, @QueryParam("revisionId") final Long revisionId,
                                  @QueryParam("clientId") final String clientId, Map<String, String> properties) {
        final NiFiWebConfigurationContext nifiWebContext = getWebConfigurationContext();
        final NiFiWebConfigurationRequestContext niFiRequestContext = ProcessorWebUtils.getRequestContext(processorId, revisionId, clientId, request);
        final ComponentDetails componentDetails = nifiWebContext.updateComponent(niFiRequestContext, null, properties);
        final Response.ResponseBuilder response = ProcessorWebUtils.applyCacheControl(Response.ok(componentDetails));
        return response.build();
    }

}
