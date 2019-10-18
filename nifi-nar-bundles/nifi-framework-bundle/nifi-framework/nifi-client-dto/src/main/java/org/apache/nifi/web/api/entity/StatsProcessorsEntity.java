package org.apache.nifi.web.api.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.nifi.web.api.dto.stats.ComponentCounterDTO;

/**
 * A serialized representation of this class can be placed in the entity body of a response to the API. This particular entity holds a reference to the counter of controller services, processors .
 */
@XmlRootElement(name = "StatsProcessorsEntity")
public class StatsProcessorsEntity extends Entity {

    private List<ComponentCounterDTO> processors;

    public List<ComponentCounterDTO> getProcessors() {
        return processors;
    }

    public void setProcessors(List<ComponentCounterDTO> processors) {
        this.processors = processors;
    }
}
