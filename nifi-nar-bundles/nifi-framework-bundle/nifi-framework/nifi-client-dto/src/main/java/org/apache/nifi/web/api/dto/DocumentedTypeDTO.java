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
package org.apache.nifi.web.api.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.xml.bind.annotation.XmlType;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Class used for providing documentation of a specified type.
 */
@XmlType(name = "documentedType")
public class DocumentedTypeDTO {

    private String type;
    private BundleDTO bundle;
    private List<ControllerServiceApiDTO> controllerServiceApis;
    private String description;
    private boolean restricted;
    private String usageRestriction;
    private Set<ExplicitRestrictionDTO> explicitRestrictions;
    private String deprecationReason;
    private Set<String> tags;
    //marks
    private String vendor = "";
    private Set<String> categories;
    private String createdDate;
    private String note;
    private String iconName = "";

    private boolean preview;

    /**
     * @return An optional description of the corresponding type
     */
    @ApiModelProperty(
            value = "The description of the type."
    )
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return Whether this type is restricted
     */
    @ApiModelProperty(
            value = "Whether this type is restricted."
    )
    public boolean isRestricted() {
        return restricted;
    }

    public void setRestricted(boolean restricted) {
        this.restricted = restricted;
    }

    /**
     * @return An optional collection of explicit restrictions
     */
    @ApiModelProperty(
            value = "An optional collection of explicit restrictions. If specified, these explicit restrictions will be enfored."
    )
    public Set<ExplicitRestrictionDTO> getExplicitRestrictions() {
        return explicitRestrictions;
    }

    public void setExplicitRestrictions(Set<ExplicitRestrictionDTO> explicitRestrictions) {
        this.explicitRestrictions = explicitRestrictions;
    }

    /**
     * @return An optional description of why the usage of this component is restricted
     */
    @ApiModelProperty(
            value = "The optional description of why the usage of this component is restricted."
    )
    public String getUsageRestriction() {
        return usageRestriction;
    }

    public void setUsageRestriction(String usageRestriction) {
        this.usageRestriction = usageRestriction;
    }

    /**
     * @return An optional description of why the usage of this component is deprecated
     */
    @ApiModelProperty(
            value = "The description of why the usage of this component is restricted."
    )
    public String getDeprecationReason() {
        return deprecationReason;
    }

    public void setDeprecationReason(String deprecationReason) {
        this.deprecationReason = deprecationReason;
    }


    /**
     * @return The type is the fully-qualified name of a Java class
     */
    @ApiModelProperty(
            value = "The fully qualified name of the type."
    )
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    /**
     * The details of the artifact that bundled this type.
     *
     * @return The bundle details
     */
    @ApiModelProperty(
            value = "The details of the artifact that bundled this type."
    )
    public BundleDTO getBundle() {
        return bundle;
    }

    public void setBundle(BundleDTO bundle) {
        this.bundle = bundle;
    }

    /**
     * If this type represents a ControllerService, this lists the APIs it implements.
     *
     * @return The listing of implemented APIs
     */
    @ApiModelProperty(
            value = "If this type represents a ControllerService, this lists the APIs it implements."
    )
    public List<ControllerServiceApiDTO> getControllerServiceApis() {
        return controllerServiceApis;
    }

    public void setControllerServiceApis(List<ControllerServiceApiDTO> controllerServiceApis) {
        this.controllerServiceApis = controllerServiceApis;
    }

    /**
     * @return The tags associated with this type
     */
    @ApiModelProperty(
            value = "The tags associated with this type."
    )
    public Set<String> getTags() {
        return tags;
    }

    public void setTags(final Set<String> tags) {
        this.tags = tags;
    }

    //marks
    @ApiModelProperty(
            value = "The description of the  vendor."
    )
    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    @ApiModelProperty(
            value = "The categories associated with this type."
    )
    public Set<String> getCategories() {
        return categories;
    }

    public void setCategories(final Set<String> categories) {
        this.categories = categories;
    }

    @ApiModelProperty(
            value = "The description of the createdDate."
    )
    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    @ApiModelProperty(
            value = "The description of the note."
    )
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @ApiModelProperty(
            value = "The icon name (eg: icon1.svg)"
    )
    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    @ApiModelProperty(
            value = "is preview or not."
    )
    public boolean isPreview() {
        return preview;
    }

    public void setPreview(boolean preview) {
        this.preview = preview;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final DocumentedTypeDTO that = (DocumentedTypeDTO) o;
        return Objects.equals(type, that.type) && Objects.equals(bundle, that.bundle);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, bundle);
    }
}
