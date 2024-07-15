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
    ],
    Secret: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ],
    PersistentVolume: [
        { name: "name", label: "Name", required: true },
        { name: "capacity", label: "Capacity", required: true },
        { name: "accessModes", label: "Access Modes", required: true },
        { name: "storageClass", label: "Storage Class", required: true },
    ],
    PersistentVolumeClaim: [
        { name: "name", label: "Name", required: true },
        { name: "storageClass", label: "Storage Class", required: true },
        { name: "accessModes", label: "Access Modes", required: true },
        { name: "resources", label: "Resources", required: true },
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
        { name: "policyTypes", label: "Policy Types", required: true },
    ],
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
    } else if (manifestType === 'Secret') {
        manifest = {
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                name: manifestData.name
            },
            data: {
                [manifestData.name]: manifestData.data
            }
        };
    } else if (manifestType === 'PersistentVolume') {
        manifest = {
            apiVersion: 'v1',
            kind: 'PersistentVolume',
            metadata: {
                name: manifestData.name
            },
            spec: {
                capacity: {
                    storage: manifestData.capacity
                },
                accessModes: [manifestData.accessModes],
                storageClassName: manifestData.storageClass
            }
        };
    } else if (manifestType === 'PersistentVolumeClaim') {
        manifest = {
            apiVersion: 'v1',
            kind: 'PersistentVolumeClaim',
            metadata: {
                name: manifestData.name
            },
            spec: {
                storageClassName: manifestData.storageClass,
                accessModes: [manifestData.accessModes],
                resources: {
                    requests: {
                        storage: manifestData.resources
                    }
                }
            }
        };
    } else if (manifestType === 'Ingress') {
        manifest = {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: manifestData.name
            },
            spec: {
                rules: [{
                    host: manifestData.host,
                    http: {
                        paths: [{
                            path: '/',
                            pathType: 'Prefix',
                            backend: {
                                service: {
                                    name: manifestData.serviceName,
                                    port: {
                                        number: parseInt(manifestData.servicePort)
                                    }
                                }
                            }
                        }]
                    }
                }]
            }
        };
    } else if (manifestType === 'Role') {
        manifest = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'Role',
            metadata: {
                name: manifestData.name
            },
            rules: JSON.parse(manifestData.rules)
        };
    } else if (manifestType === 'RoleBinding') {
        manifest = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'RoleBinding',
            metadata: {
                name: manifestData.name
            },
            roleRef: {
                apiGroup: 'rbac.authorization.k8s.io',
                kind: 'Role',
                name: manifestData.roleName
            },
            subjects: JSON.parse(manifestData.subjects)
        };
    } else if (manifestType === 'ClusterRole') {
        manifest = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'ClusterRole',
            metadata: {
                name: manifestData.name
            },
            rules: JSON.parse(manifestData.rules)
        };
    } else if (manifestType === 'ClusterRoleBinding') {
        manifest = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'ClusterRoleBinding',
            metadata: {
                name: manifestData.name
            },
            roleRef: {
                apiGroup: 'rbac.authorization.k8s.io',
                kind: 'ClusterRole',
                name: manifestData.roleName
            },
            subjects: JSON.parse(manifestData.subjects)
        };
    } else if (manifestType === 'NetworkPolicy') {
        manifest = {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'NetworkPolicy',
            metadata: {
                name: manifestData.name
            },
            spec: {
                podSelector: JSON.parse(manifestData.podSelector),
                policyTypes: [manifestData.policyTypes]
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

