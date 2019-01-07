package com.orchsym.processor.attributes;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.nifi.annotation.lifecycle.OnScheduled;
import org.apache.nifi.components.PropertyDescriptor;
import org.apache.nifi.components.PropertyValue;
import org.apache.nifi.components.Validator;
import org.apache.nifi.expression.ExpressionLanguageScope;
import org.apache.nifi.flowfile.FlowFile;
import org.apache.nifi.flowfile.attributes.BooleanAllowableValues;
import org.apache.nifi.processor.AbstractProcessor;
import org.apache.nifi.processor.ProcessContext;
import org.apache.nifi.processor.ProcessSession;
import org.apache.nifi.processor.ProcessorInitializationContext;
import org.apache.nifi.processor.Relationship;
import org.apache.nifi.processor.exception.ProcessException;
import org.apache.nifi.processor.io.InputStreamCallback;

/**
 * @author GU Guoqiang
 *
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
public abstract class AbstractExtractToAttributesProcessor extends AbstractProcessor {

    protected static final PropertyDescriptor RECURSE_CHILDREN = new PropertyDescriptor.Builder()//
            .name("recurse-children")//
            .displayName("Recurse Children")//
            .description("Indicates whether to process the children elements.")//
            .required(false)//
            .allowableValues(BooleanAllowableValues.list())//
            .defaultValue(BooleanAllowableValues.FALSE.value())//
            .addValidator(BooleanAllowableValues.validator())//
            .build();

    protected static final PropertyDescriptor ALLOW_ARRAY = new PropertyDescriptor.Builder()//
            .name("allow-array")//
            .displayName("Allow Array")//
            .description(
                    "Indicates whether to allow to extract the attributes for array elements with index in attribute name, if true, can deal with the multi-records in flowflow also, not only for sub-elements. if false, will only deal with the first elements without index.")//
            .required(false)//
            .allowableValues(BooleanAllowableValues.list())//
            .defaultValue(BooleanAllowableValues.FALSE.value())//
            .addValidator(BooleanAllowableValues.validator())//
            .build();

    protected static final PropertyDescriptor INCLUDE_FIELDS = new PropertyDescriptor.Builder()//
            .name("include-fields")//
            .displayName("Include Fields")//
            .description("Include the record fields with seperating via colon ';', If don't set this includes, also no excludes, means include all. and support expression too.")//
            .required(false)//
            .expressionLanguageSupported(ExpressionLanguageScope.FLOWFILE_ATTRIBUTES) //
            .build();

    protected static final PropertyDescriptor EXCLUDE_FIELDS = new PropertyDescriptor.Builder()//
            .name("exclude-fields")//
            .displayName("Exclude Fields")//
            .description("Exclude the record fields with seperating via colon ';'. and support expression too.")//
            .required(false)//
            .expressionLanguageSupported(ExpressionLanguageScope.FLOWFILE_ATTRIBUTES) //
            .build();

    protected static final PropertyDescriptor FIELDS_CASE_SENSITIVE = new PropertyDescriptor.Builder()//
            .name("fields-case-sensitive")//
            .displayName("Fields Case-sensitive")//
            .description("Indicates whether to match the fields for Case-sensitive or Case-insensitive.")//
            .required(false)//
            .allowableValues(BooleanAllowableValues.list())//
            .defaultValue(BooleanAllowableValues.TRUE.value())//
            .addValidator(BooleanAllowableValues.validator())//
            .build();

    public static final Relationship REL_SUCCESS = new Relationship.Builder()//
            .name("success") //
            .description("All FlowFiles that are extracted will be routed to success")//
            .build();

    public static final Relationship REL_FAILURE = new Relationship.Builder()//
            .name("failure")//
            .description("FlowFiles are routed to this relationship when the Attribute Path cannot be evaluated against the content of the FlowFile; like, if the FlowFile is not valid format.")//
            .build();

    protected List<PropertyDescriptor> properties;
    protected Set<Relationship> relationships;

    protected volatile boolean recurseChildren;
    protected volatile boolean allowArray;
    protected volatile boolean fieldsCaseSensitive;

    protected volatile Map<String, String> attrPaths;

    @Override
    protected void init(final ProcessorInitializationContext context) {
        final List<PropertyDescriptor> properties = new ArrayList<>();
        properties.add(RECURSE_CHILDREN);
        properties.add(ALLOW_ARRAY);
        properties.add(INCLUDE_FIELDS);
        properties.add(EXCLUDE_FIELDS);
        properties.add(FIELDS_CASE_SENSITIVE);
        this.properties = Collections.unmodifiableList(properties);

        final Set<Relationship> relationships = new HashSet<>();
        relationships.add(REL_SUCCESS);
        relationships.add(REL_FAILURE);
        this.relationships = Collections.unmodifiableSet(relationships);
    }

    @Override
    protected List<PropertyDescriptor> getSupportedPropertyDescriptors() {
        return properties;
    }

    @Override
    public Set<Relationship> getRelationships() {
        return relationships;
    }

    @Override
    protected PropertyDescriptor getSupportedDynamicPropertyDescriptor(String propertyDescriptorName) {
        return new PropertyDescriptor.Builder()//
                .name(propertyDescriptorName) //
                .description("Path Expression that indicates how to retrieve the value from the Object for the '" + propertyDescriptorName
                        + "', the name of attribute will be used as the prefix of attribute for flowfile.") //
                .dynamic(true) //
                .required(false)//
                .addValidator(getPathValidator()) //
                .build();
    }

    protected Validator getPathValidator() {
        return null;
    }

    @OnScheduled
    public void onScheduled(final ProcessContext context) {
        allowArray = getBoolean(context, ALLOW_ARRAY);
        recurseChildren = getBoolean(context, RECURSE_CHILDREN);
        fieldsCaseSensitive = getBoolean(context, FIELDS_CASE_SENSITIVE);

        attrPaths = new HashMap<>();

        for (Entry<PropertyDescriptor, String> entry : context.getProperties().entrySet()) {
            final PropertyDescriptor prop = entry.getKey();
            if (prop.isDynamic()) {
                attrPaths.put(prop.getName(), entry.getValue());
            }
        }
    }

    protected boolean getBoolean(final ProcessContext context, final PropertyDescriptor descriptor) {
        final PropertyValue property = context.getProperty(descriptor);
        if (property != null) { // existed
            final Boolean allowArr = property.asBoolean();
            if (allowArr != null && allowArr) { // has value
                return allowArr.booleanValue();
            }
        }
        return Boolean.parseBoolean(descriptor.getDefaultValue());
    }

    protected List<Pattern> getPatternList(final ProcessContext context, final FlowFile flowFile, final PropertyDescriptor descriptor) {
        final PropertyValue property = context.getProperty(descriptor);
        if (property != null) { // existed
            final String value = property.evaluateAttributeExpressions(flowFile).getValue();
            if (StringUtils.isNotBlank(value)) {
                List<Pattern> list = new ArrayList<>();
                for (String one : value.split(";")) {
                    if (StringUtils.isNotBlank(one)) {
                        final Pattern pattern = Pattern.compile(one.trim(), fieldsCaseSensitive ? 0 : Pattern.CASE_INSENSITIVE);
                        list.add(pattern);
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    @Override
    public void onTrigger(ProcessContext context, ProcessSession session) throws ProcessException {
        FlowFile flowFile = session.get();
        if (flowFile == null) {
            return;
        }

        if (attrPaths == null || attrPaths.isEmpty()) {
            getLogger().error("Must set the attributes paths for flowfile {}", new Object[] { flowFile });
            session.transfer(flowFile, REL_FAILURE);
            return;
        }

        final List<Pattern> includeFields = getPatternList(context, flowFile, INCLUDE_FIELDS);
        final List<Pattern> excludeFields = getPatternList(context, flowFile, EXCLUDE_FIELDS);

        final Map<String, String> extractedAttributes = new HashMap<>();
        retrieveAttributes(context, session, flowFile, extractedAttributes, includeFields, excludeFields);

        if (extractedAttributes != null && !extractedAttributes.isEmpty()) {
            flowFile = session.putAllAttributes(flowFile, extractedAttributes);
        }

        session.transfer(flowFile, REL_SUCCESS);
    }

    protected void retrieveAttributes(ProcessContext context, ProcessSession session, FlowFile flowFile, final Map<String, String> attributesFromRecords, final List<Pattern> includeFields,
            final List<Pattern> excludeFields) {
        final ConcurrentHashMap<String, String> attributes = new ConcurrentHashMap<>();
        session.read(flowFile, new InputStreamCallback() {

            @Override
            public void process(InputStream rawIn) throws IOException {
                retrieveAttributes(rawIn, attributes, includeFields, excludeFields);
            }

        });

        attributesFromRecords.putAll(attributes);
    }

    protected void retrieveAttributes(InputStream rawIn, Map<String, String> attributesFromRecords, final List<Pattern> includeFields, final List<Pattern> excludeFields) throws IOException {
        //
    }

    protected boolean ignoreField(final String fieldName, final List<Pattern> includeFields, final List<Pattern> excludeFields) {
        if (fieldName == null || fieldName.trim().isEmpty()) {
            return true;
        }
        if (match(excludeFields, fieldName)) {
            return true; // ignore
        }
        if (includeFields != null && !includeFields.isEmpty() && !match(includeFields, fieldName)) {
            return true; // not include
        } // else //if no set or matched, will be added.
        return false;
    }

    protected boolean match(final List<Pattern> matchPatterns, String fieldName) {
        boolean match = false;
        if (fieldName != null && matchPatterns != null && !matchPatterns.isEmpty()) {
            for (Pattern p : matchPatterns) {
                final Matcher matcher = p.matcher(fieldName);
                if (matcher.matches()) {
                    match = true;
                    break;
                }
            }

        }
        return match;
    }

    protected void setFieldAttribute(Map<String, String> attributes, String attrPrefix, String fieldName, Object data, int index) {
        final String name = getAttributeName(attrPrefix, fieldName, index);

        if (data instanceof byte[]) {
            data = new String((byte[]) data, StandardCharsets.UTF_8);
        }
        if (data instanceof char[]) {
            data = String.valueOf((char[]) data);
        }
        attributes.put(name, Objects.toString(data, ""));
    }

    protected String getAttributeName(String attrPrefix, String fieldName, int index) {
        StringBuffer name = new StringBuffer();
        name.append(attrPrefix.trim());

        if (fieldName != null) {
            checkDot(name);
            name.append(fieldName.trim());
        }
        if (index >= 0) {
            checkDot(name);
            name.append(index);
        }
        return name.toString().trim();
    }

    private void checkDot(StringBuffer name) {
        if (name.charAt(name.length() - 1) != '.') {
            name.append('.');
        }
    }

    protected void setAttributes(Map<String, String> attributes, final String attrPrefix, Object data, int index, final List<Pattern> includeFields, final List<Pattern> excludeFields) {
        if (data instanceof Map) {
            setMapAttributes(attributes, attrPrefix, (Map<String, Object>) data, index, includeFields, excludeFields);
        } else if (data instanceof List) {
            setListAttributes(attributes, attrPrefix, (List) data, index, includeFields, excludeFields);
        } else if (data instanceof Object[]) {
            setArrayAttributes(attributes, attrPrefix, (Object[]) data, index, includeFields, excludeFields);
        } else { // others
            setFieldAttribute(attributes, attrPrefix, null, data, index); // the field name have been contained in prefix
        }
    }

    protected void setMapAttributes(Map<String, String> attributes, final String attrPrefix, Map<String, Object> map, int index, final List<Pattern> includeFields, final List<Pattern> excludeFields) {
        for (Entry<String, Object> one : map.entrySet()) {
            final String name = one.getKey();
            final Object value = one.getValue();

            // if value is simple, filter current field
            if (isScalar(value) && ignoreField(name, includeFields, excludeFields)) {
                continue;
            }
            // if the array is simple type, filter the array name
            if (isScalarList(value) && ignoreField(name, includeFields, excludeFields)) {
                continue;

            }
            if (value instanceof Map && !recurseChildren) {
                continue;
            }

            final String mapAttrPrefix = getAttributeName(attrPrefix, name, index);
            setAttributes(attributes, mapAttrPrefix, value, -1, includeFields, excludeFields);
        }
    }

    protected void setListAttributes(Map<String, String> attributes, final String attrPrefix, List list, int index, final List<Pattern> includeFields, final List<Pattern> excludeFields) {
        final String listAttrPrefix = getAttributeName(attrPrefix, null, index);
        if (list.size() == 1) { // if only one, ignore the index
            setAttributes(attributes, listAttrPrefix, list.get(0), -1, includeFields, excludeFields);
        } else if (list.size() > 1 && allowArray) {
            for (int i = 0; i < list.size(); i++) {
                setAttributes(attributes, listAttrPrefix, list.get(i), i, includeFields, excludeFields);
            }
        }
    }

    protected void setArrayAttributes(Map<String, String> attributes, final String attrPrefix, Object[] arr, int index, final List<Pattern> includeFields, final List<Pattern> excludeFields) {
        final String listAttrPrefix = getAttributeName(attrPrefix, null, index);
        if (arr.length == 1) { // if only one, ignore the index
            setAttributes(attributes, listAttrPrefix, arr[0], -1, includeFields, excludeFields);
        } else if (arr.length > 1 && allowArray) {
            for (int i = 0; i < arr.length; i++) {
                setAttributes(attributes, listAttrPrefix, arr[i], i, includeFields, excludeFields);
            }
        }
    }

    protected boolean isScalar(final Object value) {
        return !(value instanceof Map) && !(value instanceof List) && !(value instanceof Object[]);
    }

    protected boolean isScalarList(final Object value) {
        if (!(value instanceof List)) {
            return false;
        }
        List list = (List) value;
        boolean allScalar = true;

        if (!list.isEmpty()) {
            for (Object obj : list) {
                if (!isScalar(obj)) {
                    allScalar = false;
                    break;
                }
            }
        }
        return allScalar;
    }
}
