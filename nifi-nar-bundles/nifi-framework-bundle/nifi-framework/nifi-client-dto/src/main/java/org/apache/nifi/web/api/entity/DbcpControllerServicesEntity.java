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
package org.apache.nifi.web.api.entity;

import io.swagger.annotations.ApiModelProperty;
import org.apache.nifi.web.api.dto.util.TimeAdapter;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import java.util.Date;
import java.util.Set;

/**
 * A serialized representation of this class can be placed in the entity body of a response to the API. This particular entity holds a reference to a list of DBCP controller services.
 */
@XmlRootElement(name = "dbcpControllerServicesEntity")
public class DbcpControllerServicesEntity extends Entity {

    private Date currentTime;
    private Set<DbcpControllerServiceEntity> dbcpControllerServices;

    /**
     * @return list of DBCP controller services that are being serialized
     */
    public Set<DbcpControllerServiceEntity> getDbcpControllerServices() {
        return dbcpControllerServices;
    }

    public void setDbcpControllerServices(Set<DbcpControllerServiceEntity> dbcpControllerServices) {
        this.dbcpControllerServices = dbcpControllerServices;
    }

    /**
     * @return current time on the server
     */
    @XmlJavaTypeAdapter(TimeAdapter.class)
    @ApiModelProperty(
            value = "The current time on the system.",
            dataType = "string"
    )
    public Date getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(Date currentTime) {
        this.currentTime = currentTime;
    }

}
