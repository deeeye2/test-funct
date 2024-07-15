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


