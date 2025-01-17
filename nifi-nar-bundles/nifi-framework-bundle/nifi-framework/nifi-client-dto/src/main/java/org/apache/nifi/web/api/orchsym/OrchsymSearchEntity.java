/*
 * Licensed to the Orchsym Runtime under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * this file to You under the Orchsym License, Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://github.com/orchsym/runtime/blob/master/orchsym/LICENSE
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.nifi.web.api.orchsym;

import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.nifi.web.api.entity.Entity;
import org.apache.nifi.web.api.orchsym.addition.AdditionConstants;

public class OrchsymSearchEntity extends Entity {
    protected String text = ""; // 搜索文本

    protected int page = 1; // 默认当前页为第一页
    protected int pageSize = 10;// 默认每页10条

    protected boolean desc = true; // 默认降序
    protected boolean deleted = AdditionConstants.KEY_IS_DELETED_DEFAULT; // 默认非删除

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isDesc() {
        return desc;
    }

    public void setDesc(boolean desc) {
        this.desc = desc;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    /**
     * 
     * 支持search串包含空格的多个字符的”或“匹配
     */
    public static boolean contains(String searchStr, String[] values) {
        if (StringUtils.isBlank(searchStr)) {
            return true; // 未设置，无需验证匹配，直接返回所有
        }
        if (Objects.isNull(values)) {
            return false; // 不匹配任何
        }
        final Set<String> searchList = Arrays.asList(searchStr.split(" ")).stream() //
                .filter(one -> StringUtils.isNotBlank(one))//
                .map(one -> one.trim())//
                .collect(Collectors.toSet());
        for (String part : searchList) {
            for (String value : values) {
                if (StringUtils.isNotBlank(value) // 忽略空值
                        && StringUtils.containsIgnoreCase(value, part)) {
                    return true;
                }
            }
        }
        return false;
    }
}
