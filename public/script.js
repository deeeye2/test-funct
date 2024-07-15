const fields = {
    Deployment: [
        { name: "name", label: "Name", required: true },
        { name: "image", label: "Container Image", required: true },
        { name: "replicas", label: "Replicas", required: true },
        { name: "volume", label: "Volume", required: false },
    ],
    Service: [
        { name: "name", label: "Name", required: true },
        { name: "type", label: "Service Type", required: true },
        { name: "port", label: "Port", required: true },
    ],
    ConfigMap: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ]
};

function updateForm() {
    const manifestType = document.getElementById("manifestType").value;
    const formFieldsDiv = document.getElementById("formFields");
    formFieldsDiv.innerHTML = "";
    if (fields[manifestType]) {
        fields[manifestType].forEach(field => {
            const fieldHtml = `
                <label for="${field.name}">${field.label}${field.required ? '*' : ''}:</label>
                <input type="text" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                <br>
            `;
            formFieldsDiv.innerHTML += fieldHtml;
        });
    }
}

function showPreview() {
    const form = document.getElementById("manifestForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("previewContent");
    const manifestType = formData.get("manifestType");
    const manifestData = Object.fromEntries(formData);

    let manifest = {};

    if (manifestType === 'Deployment') {
        manifest = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                name: manifestData.name,
            },
            spec: {
                replicas: parseInt(manifestData.replicas),
                selector: {
                    matchLabels: {
                        app: manifestData.name
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: manifestData.name
                        }
                    },
                    spec: {
                        containers: [{
                            name: manifestData.name,
                            image: manifestData.image
                        }]
                    }
                }
            }
        };
        if (manifestData.volume) {
            manifest.spec.template.spec.volumes = [{
                name: manifestData.volume
            }];
        }
    } else if (manifestType === 'Service') {
        manifest = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: manifestData.name
            },
            spec: {
                type: manifestData.type,
                ports: [{
                    port: parseInt(manifestData.port)
                }],
                selector: {
                    app: manifestData.name
                }
            }
        };
    } else if (manifestType === 'ConfigMap') {
        manifest = {
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                name: manifestData.name
            },
            data: {
                [manifestData.name]: manifestData.data
            }
        };
    }

    previewContent.textContent = JSON.stringify(manifest, null, 2);
    document.getElementById("preview").classList.remove("hidden");
}

function generateManifest() {
    const previewContent = document.getElementById("previewContent").textContent;
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

function editForm() {
    document.getElementById("preview").classList.add("hidden");
}

function cancelForm() {
    document.getElementById("manifestForm").reset();
    document.getElementById("formFields").innerHTML = "";
    document.getElementById("preview").classList.add("hidden");
}
