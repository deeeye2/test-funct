const terraformFields = {
    aws_instance: [
        { name: "ami", label: "AMI", required: true },
        { name: "instance_type", label: "Instance Type", required: true, options: ["t2.micro", "t2.small", "t2.medium"] },
        { name: "key_name", label: "Key Name", required: false },
        { name: "vpc_security_group_ids", label: "VPC Security Group IDs (comma-separated)", required: false },
        { name: "subnet_id", label: "Subnet ID", required: false },
        { name: "associate_public_ip_address", label: "Associate Public IP Address", required: false, options: ["true", "false"] },
        { name: "tags", label: "Tags (JSON format)", required: false },
        { name: "ebs_block_device", label: "EBS Block Device (JSON format)", required: false }
    ],
    aws_s3_bucket: [
        { name: "bucket", label: "Bucket Name", required: true },
        { name: "acl", label: "ACL", required: true, options: ["private", "public-read", "public-read-write", "authenticated-read"] },
        { name: "force_destroy", label: "Force Destroy", required: false, options: ["true", "false"] }
    ],
    aws_security_group: [
        { name: "name", label: "Name", required: true },
        { name: "description", label: "Description", required: true },
        { name: "vpc_id", label: "VPC ID", required: true },
        { name: "ingress", label: "Ingress Rules (JSON format)", required: false },
        { name: "egress", label: "Egress Rules (JSON format)", required: false }
    ],
    google_compute_instance: [
        { name: "name", label: "Name", required: true },
        { name: "machine_type", label: "Machine Type", required: true, options: ["f1-micro", "g1-small", "n1-standard-1"] },
        { name: "zone", label: "Zone", required: true },
        { name: "tags", label: "Tags (JSON format)", required: false }
    ],
    google_storage_bucket: [
        { name: "name", label: "Bucket Name", required: true },
        { name: "location", label: "Location", required: true, options: ["US", "EU", "ASIA"] },
        { name: "storage_class", label: "Storage Class", required: false, options: ["STANDARD", "NEARLINE", "COLDLINE", "ARCHIVE"] }
    ],
    azure_virtual_machine: [
        { name: "name", label: "Name", required: true },
        { name: "resource_group_name", label: "Resource Group Name", required: true },
        { name: "vm_size", label: "VM Size", required: true, options: ["Standard_DS1_v2", "Standard_DS2_v2", "Standard_DS3_v2"] },
        { name: "os_disk", label: "OS Disk (JSON format)", required: true },
        { name: "network_interface_ids", label: "Network Interface IDs (JSON format)", required: true }
    ],
};

function goToTerraformDetails() {
    const resourceTypeSelect = document.getElementById("terraformResourceType");
    const selectedOptions = Array.from(resourceTypeSelect.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one resource type.');
        return;
    }

    const formFieldsDiv = document.getElementById("terraformFormFields");
    formFieldsDiv.innerHTML = "";

    selectedOptions.forEach(type => {
        if (terraformFields[type]) {
            const fieldSet = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = type.replace(/_/g, ' ').toUpperCase();
            fieldSet.appendChild(legend);

            terraformFields[type].forEach(field => {
                const fieldHtml = field.options
                    ? `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <select id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <br>
                    `
                    : `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <input type="text" id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                        <br>
                    `;
                fieldSet.innerHTML += fieldHtml;
            });

            formFieldsDiv.appendChild(fieldSet);
        }
    });

    document.getElementById("terraformSelectionStep").classList.add("hidden");
    document.getElementById("terraformDetailsStep").classList.remove("hidden");
}

function goBackTerraform() {
    document.getElementById("terraformSelectionStep").classList.remove("hidden");
    document.getElementById("terraformDetailsStep").classList.add("hidden");
}

function showTerraformPreview() {
    const form = document.getElementById("terraformForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("terraformPreviewContent");
    const resourceTypeSelect = document.getElementById("terraformResourceType");
    const selectedOptions = Array.from(resourceTypeSelect.selectedOptions).map(option => option.value);

    const resources = selectedOptions.map(type => {
        let resource = { [type]: {} };

        terraformFields[type].forEach(field => {
            resource[type][field.name] = formData.get(`${field.name}-${type}`);
        });

        return resource;
    });

    const terraformConfig = resources.map(resource => {
        const type = Object.keys(resource)[0];
        const config = resource[type];
        return `
resource "${type}" "${config.name || config.bucket || config.name}" {
    ${Object.keys(config).map(key => `${key} = "${config[key]}"`).join('\n    ')}
}
        `;
    }).join('\n');

    previewContent.textContent = terraformConfig.trim();
    document.getElementById("terraformDetailsStep").classList.add("hidden");
    document.getElementById("terraformPreviewStep").classList.remove("hidden");
}

function generateTerraformConfig() {
    const previewContent = document.getElementById("terraformPreviewContent").textContent;
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'main.tf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editTerraformForm() {
    document.getElementById("terraformPreviewStep").classList.add("hidden");
    document.getElementById("terraformDetailsStep").classList.remove("hidden");
}

function cancelTerraformForm() {
    document.getElementById("terraformForm").reset();
    document.getElementById("terraformFormFields").innerHTML = "";
    document.getElementById("terraformSelectionStep").classList.remove("hidden");
    document.getElementById("terraformDetailsStep").classList.add("hidden");
    document.getElementById("terraformPreviewStep").classList.add("hidden");
}


const terraformFields = {
    aws_instance: [
        { name: "ami", label: "AMI", required: true },
        { name: "instance_type", label: "Instance Type", required: true, options: ["t2.micro", "t2.small", "t2.medium"] },
        { name: "key_name", label: "Key Name", required: false },
    ],
    aws_s3_bucket: [
        { name: "bucket", label: "Bucket Name", required: true },
        { name: "acl", label: "ACL", required: true, options: ["private", "public-read", "public-read-write", "authenticated-read"] },
    ],
    aws_security_group: [
        { name: "name", label: "Name", required: true },
        { name: "description", label: "Description", required: true },
        { name: "vpc_id", label: "VPC ID", required: true },
    ],
    google_compute_instance: [
        { name: "name", label: "Name", required: true },
        { name: "machine_type", label: "Machine Type", required: true, options: ["f1-micro", "g1-small", "n1-standard-1"] },
        { name: "zone", label: "Zone", required: true },
    ],
    google_storage_bucket: [
        { name: "name", label: "Bucket Name", required: true },
        { name: "location", label: "Location", required: true, options: ["US", "EU", "ASIA"] },
    ],
    azure_virtual_machine: [
        { name: "name", label: "Name", required: true },
        { name: "resource_group_name", label: "Resource Group Name", required: true },
        { name: "vm_size", label: "VM Size", required: true, options: ["Standard_DS1_v2", "Standard_DS2_v2", "Standard_DS3_v2"] },
    ],
};

function goToTerraformDetails() {
    const resourceTypeSelect = document.getElementById("terraformResourceType");
    const selectedOptions = Array.from(resourceTypeSelect.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one resource type.');
        return;
    }

    const formFieldsDiv = document.getElementById("terraformFormFields");
    formFieldsDiv.innerHTML = "";

    selectedOptions.forEach(type => {
        if (terraformFields[type]) {
            const fieldSet = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = type.replace(/_/g, ' ').toUpperCase();
            fieldSet.appendChild(legend);

            terraformFields[type].forEach(field => {
                const fieldHtml = field.options
                    ? `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <select id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <br>
                    `
                    : `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <input type="text" id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                        <br>
                    `;
                fieldSet.innerHTML += fieldHtml;
            });

            formFieldsDiv.appendChild(fieldSet);
        }
    });

    document.getElementById("terraformSelectionStep").classList.add("hidden");
    document.getElementById("terraformDetailsStep").classList.remove("hidden");
}

function goBackTerraform() {
    document.getElementById("terraformSelectionStep").classList.remove("hidden");
    document.getElementById("terraformDetailsStep").classList.add("hidden");
}

function showTerraformPreview() {
    const form = document.getElementById("terraformForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("terraformPreviewContent");
    const resourceTypeSelect = document.getElementById("terraformResourceType");
    const selectedOptions = Array.from(resourceTypeSelect.selectedOptions).map(option => option.value);

    const resources = selectedOptions.map(type => {
        let resource = { [type]: {} };

        terraformFields[type].forEach(field => {
            resource[type][field.name] = formData.get(`${field.name}-${type}`);
        });

        return resource;
    });

    const terraformConfig = resources.map(resource => {
        const type = Object.keys(resource)[0];
        const config = resource[type];
        return `
resource "${type}" "${config.name || config.bucket || config.name}" {
    ${Object.keys(config).map(key => `${key} = "${config[key]}"`).join('\n    ')}
}
        `;
    }).join('\n');

    previewContent.textContent = terraformConfig.trim();
    document.getElementById("terraformDetailsStep").classList.add("hidden");
    document.getElementById("terraformPreviewStep").classList.remove("hidden");
}

function generateTerraformConfig() {
    const previewContent = document.getElementById("terraformPreviewContent").textContent;
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'main.tf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editTerraformForm() {
    document.getElementById("terraformPreviewStep").classList.add("hidden");
    document.getElementById("terraformDetailsStep").classList.remove("hidden");
}

function cancelTerraformForm() {
    document.getElementById("terraformForm").reset();
    document.getElementById("terraformFormFields").innerHTML = "";
    document.getElementById("terraformSelectionStep").classList.remove("hidden");
    document.getElementById("terraformDetailsStep").classList.add("hidden");
    document.getElementById("terraformPreviewStep").classList.add("hidden");
}

const ansibleFields = {
    package: [
        { name: "name", label: "Package Name", required: true },
        { name: "state", label: "State", required: true, options: ["present", "absent", "latest"] },
    ],
    service: [
        { name: "name", label: "Service Name", required: true },
        { name: "state", label: "State", required: true, options: ["started", "stopped", "restarted"] },
        { name: "enabled", label: "Enabled", required: true, options: ["yes", "no"] },
    ],
    file: [
        { name: "path", label: "Path", required: true },
        { name: "state", label: "State", required: true, options: ["file", "directory", "absent"] },
    ],
    copy: [
        { name: "src", label: "Source", required: true },
        { name: "dest", label: "Destination", required: true },
    ],
    command: [
        { name: "cmd", label: "Command", required: true },
    ],
    user: [
        { name: "name", label: "Username", required: true },
        { name: "state", label: "State", required: true, options: ["present", "absent"] },
    ],
};

function goToAnsibleDetails() {
    const playbookTypeSelect = document.getElementById("ansiblePlaybookType");
    const selectedOptions = Array.from(playbookTypeSelect.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one playbook task.');
        return;
    }

    const formFieldsDiv = document.getElementById("ansibleFormFields");
    formFieldsDiv.innerHTML = "";

    selectedOptions.forEach(type => {
        if (ansibleFields[type]) {
            const fieldSet = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            fieldSet.appendChild(legend);

            ansibleFields[type].forEach(field => {
                const fieldHtml = field.options
                    ? `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <select id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <br>
                    `
                    : `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <input type="text" id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                        <br>
                    `;
                fieldSet.innerHTML += fieldHtml;
            });

            formFieldsDiv.appendChild(fieldSet);
        }
    });

    document.getElementById("ansibleSelectionStep").classList.add("hidden");
    document.getElementById("ansibleDetailsStep").classList.remove("hidden");
}

function goBackAnsible() {
    document.getElementById("ansibleSelectionStep").classList.remove("hidden");
    document.getElementById("ansibleDetailsStep").classList.add("hidden");
}

function showAnsiblePreview() {
    const form = document.getElementById("ansibleForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("ansiblePreviewContent");
    const playbookTypeSelect = document.getElementById("ansiblePlaybookType");
    const selectedOptions = Array.from(playbookTypeSelect.selectedOptions).map(option => option.value);

    const tasks = selectedOptions.map(type => {
        let task = { [type]: {} };

        ansibleFields[type].forEach(field => {
            task[type][field.name] = formData.get(`${field.name}-${type}`);
        });

        return task;
    });

    const playbook = {
        hosts: "all",
        tasks: tasks
    };

    previewContent.textContent = YAML.stringify(playbook);
    document.getElementById("ansibleDetailsStep").classList.add("hidden");
    document.getElementById("ansiblePreviewStep").classList.remove("hidden");
}

function generateAnsiblePlaybook() {
    const previewContent = document.getElementById("ansiblePreviewContent").textContent;
    const blob = new Blob([previewContent], { type: 'application/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'playbook.yml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editAnsibleForm() {
    document.getElementById("ansiblePreviewStep").classList.add("hidden");
    document.getElementById("ansibleDetailsStep").classList.remove("hidden");
}

function cancelAnsibleForm() {
    document.getElementById("ansibleForm").reset();
    document.getElementById("ansibleFormFields").innerHTML = "";
    document.getElementById("ansibleSelectionStep").classList.remove("hidden");
    document.getElementById("ansibleDetailsStep").classList.add("hidden");
    document.getElementById("ansiblePreviewStep").classList.add("hidden");
}
const k8sFields = {
    Deployment: [
        { name: "name", label: "Name", required: true },
        { name: "image", label: "Container Image", required: true },
        { name: "replicas", label: "Replicas", required: true },
        { name: "volume", label: "Volume", required: false },
    ],
    Service: [
        { name: "name", label: "Name", required: true },
        { name: "type", label: "Service Type", required: true, options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"] },
        { name: "port", label: "Port", required: true },
    ],
    ConfigMap: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ],
    Secret: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ],
    PersistentVolume: [
        { name: "name", label: "Name", required: true },
        { name: "capacity", label: "Capacity", required: true, options: ["1Gi", "5Gi", "10Gi", "50Gi", "100Gi"] },
        { name: "accessModes", label: "Access Modes", required: true, options: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"] },
        { name: "storageClass", label: "Storage Class", required: true, options: ["standard", "fast", "slow"] },
    ],
    PersistentVolumeClaim: [
        { name: "name", label: "Name", required: true },
        { name: "storageClass", label: "Storage Class", required: true, options: ["standard", "fast", "slow"] },
        { name: "accessModes", label: "Access Modes", required: true, options: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"] },
        { name: "resources", label: "Resources", required: true, options: ["1Gi", "5Gi", "10Gi", "50Gi", "100Gi"] },
    ],
    Ingress: [
        { name: "name", label: "Name", required: true },
        { name: "host", label: "Host", required: true },
        { name: "serviceName", label: "Service Name", required: true },
        { name: "servicePort", label: "Service Port", required: true },
    ],
    Role: [
        { name: "name", label: "Name", required: true },
        { name: "rules", label: "Rules", required: true },
    ],
    RoleBinding: [
        { name: "name", label: "Name", required: true },
        { name: "roleName", label: "Role Name", required: true },
        { name: "subjects", label: "Subjects", required: true },
    ],
    ClusterRole: [
        { name: "name", label: "Name", required: true },
        { name: "rules", label: "Rules", required: true },
    ],
    ClusterRoleBinding: [
        { name: "name", label: "Name", required: true },
        { name: "roleName", label: "Role Name", required: true },
        { name: "subjects", label: "Subjects", required: true },
    ],
    NetworkPolicy: [
        { name: "name", label: "Name", required: true },
        { name: "podSelector", label: "Pod Selector", required: true },
        { name: "policyTypes", label: "Policy Types", required: true, options: ["Ingress", "Egress"] },
    ],
};

const dockerfileFields = {
    node: [
        { name: "version", label: "Node.js Version", required: true, options: ["14", "16", "18"] },
        { name: "appDirectory", label: "Application Directory", required: true },
        { name: "startCommand", label: "Start Command", required: true },
    ],
    python: [
        { name: "version", label: "Python Version", required: true, options: ["3.8", "3.9", "3.10"] },
        { name: "appDirectory", label: "Application Directory", required: true },
        { name: "startCommand", label: "Start Command", required: true },
    ],
    golang: [
        { name: "version", label: "Go Version", required: true, options: ["1.16", "1.17", "1.18"] },
        { name: "appDirectory", label: "Application Directory", required: true },
        { name: "startCommand", label: "Start Command", required: true },
    ],
    java: [
        { name: "version", label: "Java Version", required: true, options: ["8", "11", "16"] },
        { name: "appDirectory", label: "Application Directory", required: true },
        { name: "startCommand", label: "Start Command", required: true },
    ],
    nginx: [
        { name: "configFile", label: "Nginx Config File", required: true },
        { name: "documentRoot", label: "Document Root", required: true },
    ],
    alpine: [
        { name: "commands", label: "Commands to Run", required: true },
    ]
};

function goToDockerfileDetails() {
    const baseImage = document.getElementById("dockerfileBaseImage").value;

    if (!baseImage) {
        alert('Please select a base image.');
        return;
    }

    const formFieldsDiv = document.getElementById("dockerfileFormFields");
    formFieldsDiv.innerHTML = "";

    if (dockerfileFields[baseImage]) {
        dockerfileFields[baseImage].forEach(field => {
            const fieldHtml = field.options
                ? `
                    <label for="${field.name}-${baseImage}">${field.label}${field.required ? '*' : ''}:</label>
                    <select id="${field.name}-${baseImage}" name="${field.name}-${baseImage}" ${field.required ? 'required' : ''}>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                    <br>
                `
                : `
                    <label for="${field.name}-${baseImage}">${field.label}${field.required ? '*' : ''}:</label>
                    <input type="text" id="${field.name}-${baseImage}" name="${field.name}-${baseImage}" ${field.required ? 'required' : ''}>
                    <br>
                `;
            formFieldsDiv.innerHTML += fieldHtml;
        });
    }

    document.getElementById("dockerfileSelectionStep").classList.add("hidden");
    document.getElementById("dockerfileDetailsStep").classList.remove("hidden");
}

function goBackDockerfile() {
    document.getElementById("dockerfileSelectionStep").classList.remove("hidden");
    document.getElementById("dockerfileDetailsStep").classList.add("hidden");
}

function showDockerfilePreview() {
    const form = document.getElementById("dockerfileForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("dockerfilePreviewContent");
    const baseImage = document.getElementById("dockerfileBaseImage").value;

    let dockerfile = `FROM ${baseImage}:${formData.get(`version-${baseImage}`)}\n`;

    if (baseImage === "node" || baseImage === "python" || baseImage === "golang" || baseImage === "java") {
        dockerfile += `
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["${formData.get(`startCommand-${baseImage}`)}"]
        `;
    } else if (baseImage === "nginx") {
        dockerfile += `
COPY ${formData.get(`configFile-${baseImage}`)} /etc/nginx/nginx.conf
COPY ${formData.get(`documentRoot-${baseImage}`)} /usr/share/nginx/html
        `;
    } else if (baseImage === "alpine") {
        dockerfile += `
RUN ${formData.get(`commands-${baseImage}`)}
        `;
    }

    previewContent.textContent = dockerfile.trim();
    document.getElementById("dockerfileDetailsStep").classList.add("hidden");
    document.getElementById("dockerfilePreviewStep").classList.remove("hidden");
}

function generateDockerfile() {
    const previewContent = document.getElementById("dockerfilePreviewContent").textContent;
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Dockerfile';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editDockerfileForm() {
    document.getElementById("dockerfilePreviewStep").classList.add("hidden");
    document.getElementById("dockerfileDetailsStep").classList.remove("hidden");
}

function cancelDockerfileForm() {
    document.getElementById("dockerfileForm").reset();
    document.getElementById("dockerfileFormFields").innerHTML = "";
    document.getElementById("dockerfileSelectionStep").classList.remove("hidden");
    document.getElementById("dockerfileDetailsStep").classList.add("hidden");
    document.getElementById("dockerfilePreviewStep").classList.add("hidden");
}

function goToK8sDetails() {
    const manifestTypeSelect = document.getElementById("k8sManifestType");
    const selectedOptions = Array.from(manifestTypeSelect.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one manifest type.');
        return;
    }

    const formFieldsDiv = document.getElementById("k8sFormFields");
    formFieldsDiv.innerHTML = "";

    selectedOptions.forEach(type => {
        if (k8sFields[type]) {
            const fieldSet = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = type;
            fieldSet.appendChild(legend);

            k8sFields[type].forEach(field => {
                const fieldHtml = field.options
                    ? `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <select id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <br>
                    `
                    : `
                        <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                        <input type="text" id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                        <br>
                    `;
                fieldSet.innerHTML += fieldHtml;
            });

            formFieldsDiv.appendChild(fieldSet);
        }
    });

    document.getElementById("k8sSelectionStep").classList.add("hidden");
    document.getElementById("k8sDetailsStep").classList.remove("hidden");
}

function goBackK8s() {
    document.getElementById("k8sSelectionStep").classList.remove("hidden");
    document.getElementById("k8sDetailsStep").classList.add("hidden");
}

function showK8sPreview() {
    const form = document.getElementById("k8sManifestForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("k8sPreviewContent");
    const manifestTypeSelect = document.getElementById("k8sManifestType");
    const selectedOptions = Array.from(manifestTypeSelect.selectedOptions).map(option => option.value);

    const manifests = [];

    selectedOptions.forEach(type => {
        let manifest = {};

        if (type === 'Deployment') {
            manifest = {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    name: formData.get(`name-Deployment`),
                },
                spec: {
                    replicas: parseInt(formData.get(`replicas-Deployment`)),
                    selector: {
                        matchLabels: {
                            app: formData.get(`name-Deployment`)
                        }
                    },
                    template: {
                        metadata: {
                            labels: {
                                app: formData.get(`name-Deployment`)
                            }
                        },
                        spec: {
                            containers: [{
                                name: formData.get(`name-Deployment`),
                                image: formData.get(`image-Deployment`)
                            }]
                        }
                    }
                }
            };
            if (formData.get(`volume-Deployment`)) {
                manifest.spec.template.spec.volumes = [{
                    name: formData.get(`volume-Deployment`)
                }];
            }
        } else if (type === 'Service') {
            manifest = {
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: formData.get(`name-Service`)
                },
                spec: {
                    type: formData.get(`type-Service`),
                    ports: [{
                        port: parseInt(formData.get(`port-Service`))
                    }],
                    selector: {
                        app: formData.get(`name-Service`)
                    }
                }
            };
        } else if (type === 'ConfigMap') {
            manifest = {
                apiVersion: 'v1',
                kind: 'ConfigMap',
                metadata: {
                    name: formData.get(`name-ConfigMap`)
                },
                data: {
                    [formData.get(`name-ConfigMap`)]: formData.get(`data-ConfigMap`)
                }
            };
        } else if (type === 'Secret') {
            manifest = {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: formData.get(`name-Secret`)
                },
                data: {
                    [formData.get(`name-Secret`)]: formData.get(`data-Secret`)
                }
            };
        } else if (type === 'PersistentVolume') {
            manifest = {
                apiVersion: 'v1',
                kind: 'PersistentVolume',
                metadata: {
                    name: formData.get(`name-PersistentVolume`)
                },
                spec: {
                    capacity: {
                        storage: formData.get(`capacity-PersistentVolume`)
                    },
                    accessModes: [formData.get(`accessModes-PersistentVolume`)],
                    storageClassName: formData.get(`storageClass-PersistentVolume`)
                }
            };
        } else if (type === 'PersistentVolumeClaim') {
            manifest = {
                apiVersion: 'v1',
                kind: 'PersistentVolumeClaim',
                metadata: {
                    name: formData.get(`name-PersistentVolumeClaim`)
                },
                spec: {
                    storageClassName: formData.get(`storageClass-PersistentVolumeClaim`),
                    accessModes: [formData.get(`accessModes-PersistentVolumeClaim`)],
                    resources: {
                        requests: {
                            storage: formData.get(`resources-PersistentVolumeClaim`)
                        }
                    }
                }
            };
        } else if (type === 'Ingress') {
            manifest = {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'Ingress',
                metadata: {
                    name: formData.get(`name-Ingress`)
                },
                spec: {
                    rules: [{
                        host: formData.get(`host-Ingress`),
                        http: {
                            paths: [{
                                path: '/',
                                pathType: 'Prefix',
                                backend: {
                                    service: {
                                        name: formData.get(`serviceName-Ingress`),
                                        port: {
                                            number: parseInt(formData.get(`servicePort-Ingress`))
                                        }
                                    }
                                }
                            }]
                        }
                    }]
                }
            };
        } else if (type === 'Role') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'Role',
                metadata: {
                    name: formData.get(`name-Role`)
                },
                rules: JSON.parse(formData.get(`rules-Role`))
            };
        } else if (type === 'RoleBinding') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'RoleBinding',
                metadata: {
                    name: formData.get(`name-RoleBinding`)
                },
                roleRef: {
                    apiGroup: 'rbac.authorization.k8s.io',
                    kind: 'Role',
                    name: formData.get(`roleName-RoleBinding`)
                },
                subjects: JSON.parse(formData.get(`subjects-RoleBinding`))
            };
        } else if (type === 'ClusterRole') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRole',
                metadata: {
                    name: formData.get(`name-ClusterRole`)
                },
                rules: JSON.parse(formData.get(`rules-ClusterRole`))
            };
        } else if (type === 'ClusterRoleBinding') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRoleBinding',
                metadata: {
                    name: formData.get(`name-ClusterRoleBinding`)
                },
                roleRef: {
                    apiGroup: 'rbac.authorization.k8s.io',
                    kind: 'ClusterRole',
                    name: formData.get(`roleName-ClusterRoleBinding`)
                },
                subjects: JSON.parse(formData.get(`subjects-ClusterRoleBinding`))
            };
        } else if (type === 'NetworkPolicy') {
            manifest = {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'NetworkPolicy',
                metadata: {
                    name: formData.get(`name-NetworkPolicy`)
                },
                spec: {
                    podSelector: JSON.parse(formData.get(`podSelector-NetworkPolicy`)),
                    policyTypes: [formData.get(`policyTypes-NetworkPolicy`)]
                }
            };
        }

        manifests.push(manifest);
    });

    previewContent.textContent = manifests.map(manifest => JSON.stringify(manifest, null, 2)).join('\n---\n');
    document.getElementById("k8sDetailsStep").classList.add("hidden");
    document.getElementById("k8sPreviewStep").classList.remove("hidden");
}

function generateK8sManifest() {
    const previewContent = document.getElementById("k8sPreviewContent").textContent;
    const blob = new Blob([previewContent], { type: 'application/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'manifest.yaml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editK8sForm() {
    document.getElementById("k8sPreviewStep").classList.add("hidden");
    document.getElementById("k8sDetailsStep").classList.remove("hidden");
}

function cancelK8sForm() {
    document.getElementById("k8sManifestForm").reset();
    document.getElementById("k8sFormFields").innerHTML = "";
    document.getElementById("k8sSelectionStep").classList.remove("hidden");
    document.getElementById("k8sDetailsStep").classList.add("hidden");
    document.getElementById("k8sPreviewStep").classList.add("hidden");
}


